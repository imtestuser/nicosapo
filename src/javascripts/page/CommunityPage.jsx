import CastPage from '../page/CastPage';

export default class CommunityPage extends CastPage {
  putWidgets() {
    const props = {
      buttonOrder    : `DEFAULT`,
      enableARButton : false,
      enableACButton : true,
      enableAPButton : false,
      enableExBar    : false,
      position       : `AFTER`,
      requireInline  : true,
      element4Buttons: document.getElementById('comSetting_hide'),
      idName4ExBar   : `siteHeader` // TODO: temp
    };
    super.putWidgets(props);
  }
}
