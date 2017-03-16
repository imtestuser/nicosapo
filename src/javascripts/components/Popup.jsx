import React from 'react';
import ReactDOM from 'react-dom';
import store from 'store'
import Api from '../api/Api'
import UserThumbnails from "../components/UserThumbnails";
import OfficialThumbnails from "../components/OfficialThumbnails";

const _split = (arr, count) => {
  const splitted = [];
  for (let i = 0; i < Math.ceil(arr.length / count); i++) {
    const j = i * count;
    const p = arr.slice(j, j + count); // i*cnt 番目から i*cnt+cnt 番目まで取得
    splitted.push(p);                    // 取得したものを newArr に追加
  }
  return splitted;
}


// linkd = [
//   1: [Array[3]],
//   2: [Array[6]]
// ]
const _link = (arr) => {
  const linked = [];
  for (let i = 0; i < arr.length; i++) {
    const inner = [];
    if (i > 0) {
      for (let j = 0; j < linked[i-1].length; j++) {
        inner.push(linked[i-1][j]);
      }
    }
    for (let j = 0; j < arr[i].length; j++) {
      inner.push(arr[i][j]);
    }
    linked.push(inner);
  }
  return linked;
}

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'user',
      loading: true,
      videoInfoList: []
    };
    this.loadCasts = this.loadCasts.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    this.loadCasts('user');
    if (store.get('options.showReserved.enable') == 'enable') {
      this.setState({ showReserve: false });
    } else {
      this.setState({ showReserve: true });
    }
  }

  loadCasts() {
    this.setState({ loading: true }, () => {
      Api.isLogined()
      .catch(() => {
        this.setState({ loading: 'show',isLogined: false });
      })
      .then(() => Api.loadCasts(this.state.selectedTab))
      .then((videoInfoList) => {
        // パフォーマンス対策．放送データを分割してsetTimeoutで少しずつ処理する．
        // React は差分描画するので細かく処理すると有利．
        const splitted = _split(videoInfoList, 18);
        const linked = _link(splitted);
        linked.forEach((item, index) => {
          setTimeout(() => {
            this.setState({ videoInfoList: item });
          }, index * 5)
        });
        this.setState({ loading: false });
      })
    });
  }

  toggleTab(e) {
    if (e.target.id === this.state.selectedTab) {
      return;
    }
    switch(e.target.id) {
      case 'user':
        this.setState({ selectedTab: 'user', 'videoInfoList': [] }, this.loadCasts());
        break;
      case 'official':
        this.setState({ selectedTab: 'official', 'videoInfoList': null }, this.loadCasts());
        break;
      case 'future':
        // this.setState({ 'videoInfoList': null });
        this.setState({ selectedTab: 'future', videoInfoList: null }, this.loadCasts());
        break;
      default:
        this.setState({ selectedTab: 'user' }, this.loadCasts());
        break;
    }
  }

  render() {
    return (
      <div id="wrapper">
        <div id="menu">
          <div className='avator'></div>
          <span className='username'>放送中の番組</span>
          <a className='menu-button' href='options.html' target='_blank'>
            <span className="octicon mega-octicon octicon-tools"></span>
            <span className="title">設定</span>
          </a>
          <a className='menu-button' href='http://live.nicovideo.jp/my' target='_blank'>
            <span className="octicon mega-octicon octicon-radio-tower"></span>
              <span className="title">マイページ</span>
            </a>
          </div>
          <div id="tab-container">
            <div id="user" className={this.state.selectedTab === 'user' ? `tab selected` : `tab non-selected`} onClick={this.toggleTab}>フォロー中</div>
            <div id="official" className={this.state.selectedTab === 'official' ? `tab selected` : `tab non-selected`} onClick={this.toggleTab}>公式</div>
            <div id="future" className={this.state.selectedTab === 'future' ? `tab selected` : `tab non-selected`} onClick={this.toggleTab}>未来の公式</div>
          </div>
          <div id="communities" className={this.state.loading ? 'nowloading' : ''}>
            {(() => {
              if (this.state.noCast) {
                return (
                  <div class="message"> {
                    this.state.showReserve
                      ? '放送中/予約中の番組がありません．'
                      : '放送中の番組がありません．'
                  } </div>
                )
              }
              if (this.state.isLogined === false) {
                return (
                  <div class="message">
                    'ニコニコ動画にログインしていません．ログインしてから再度試してください．'
                  </div>
                );
              }
              if (this.state.selectedTab === 'user') {
                return ( <UserThumbnails programs={ this.state.videoInfoList }/> );
              }
              if (this.state.selectedTab === 'official' || this.state.selectedTab === 'future') {
                return ( <OfficialThumbnails programs={ this.state.videoInfoList }/> );
              }
            })()}
          </div>
        </div>
      );
    }
}
