/*global describe, it, before */

import { expect } from 'chai'
import FollowingCommunities from '../src/javascripts/modules/FollowingCommunities'

const followingComunities = new FollowingCommunities();
followingComunities.push([
  '000000',
  '111111',
  '222222',
  '333333',
]);
followingComunities.push([
  '000000',
  '111111',
  '222222',
  '333333',
  '444444',
  '555555'
]);

describe('FollowingComunities', function() {
    it('#ALL は 最新のコミュニティの id の Array を返却する．', function() {
      const all = followingComunities.query('ALL');
      expect(all).to.eql([
        '000000',
        '111111',
        '222222',
        '333333',
        '444444',
        '555555'
      ]);
    });
    it('#ONLY_JUST_FOLLOWED はフォローしたばかりの id の Array を返却する．', function() {
      const followed_1 = followingComunities.query('ONLY_JUST_FOLLOWED');
      expect(followed_1).to.eql([
        '444444',
        '555555'
      ]);
    });
    it('#ONLY_JUST_FOLLOWED はフォローしたばかりの id の Array を返却する．', function() {
      followingComunities.push([
        '000000',
        '111111',
        '666666'
      ]);
      const followed_2 = followingComunities.query('ONLY_JUST_FOLLOWED');
      expect(followed_2).to.eql([
        '666666',
      ]);
    });
});
