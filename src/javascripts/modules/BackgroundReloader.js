import _ from 'lodash'
import Api from "../api/Api"
import Common from '../common/Common'
import Db from '../modules/db'
import Badge from '../modules/Badge'
import Alert from '../modules/Alert'
import VideoInfoUtil from '../modules/VideoInfoUtil'
import FollowingCommunities from '../modules/FollowingCommunities'
import CastingCommunities from '../modules/CastingCommunities'

const _followingCommunities = new FollowingCommunities();
const _castingCommunities = new CastingCommunities();

export default class BackgroundReloader {
  static run() {
    Promise.resolve()
    .then(() => Api.isLogined())
    .catch(() => {
      Badge.set('x')
    })
    .then(Common.sleep(2000))
    .then(() => Api.loadCasts('user'))
    .then(($videoInfoList) => {
      // const list = $videoInfoList;
      const list = VideoInfoUtil.removeReservation($videoInfoList);
      BackgroundReloader._resetBadge(list);
      _castingCommunities.push(list);
      return new Promise((resolve) => {
        resolve();
      });
    })
    .then(() => Api.getCheckList())
    .then((idList) => {
      _followingCommunities.push(idList);
      return new Promise((resolve) => {
        resolve();
      });
    })
    .then(BackgroundReloader._alertEach);
  }

  static _resetBadge($videoInfoList) {
    const zero2empty = (num) => num === 0 ? '' : num;
    const text = zero2empty($videoInfoList.length);
    Badge.setText(text);
  }

  static _resetList($videoInfos) {
    _followingCommunities.push($videoInfos);
    _castingCommunities.push($videoInfos);
  }

  static _alertEach() { // TODO: require argument.
    const justStartedCommunities  = _castingCommunities.query('ONLY_JUST_STARTED');    // Array of jQuery Objects.
    const justFollowedCommunities = _followingCommunities.query('ONLY_JUST_FOLLOWED'); // Array of Integer.
    _.each(justStartedCommunities, (community) => {
      console.info('justStarted');
      const commuId = community.find('community id').text();
      const videoId = community.find('video id').text();
      const number = Number(commuId);
      console.info(videoId);
      if (justFollowedCommunities.includes(number)) {
        return; // `continue` for lodash.
      }
      if (Db.contains('autoEnterCommunityList', commuId)) {
        return; // `continue` for lodash.
      }
      if (Db.contains('autoEnterProgramList', videoId)) {
        return; // `continue` for lodash.
      }
      Alert.fire(community);
    });
  }
}
