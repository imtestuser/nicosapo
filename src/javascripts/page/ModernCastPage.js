import $ from 'jquery'
import Page from '../page/Page';
import AutoRedirectButton from "../buttons/AutoRedirectButton";
import AutoEnterCommunityButton from "../buttons/AutoEnterCommunityButton";
import Common from "../common/Common";
import IdHolder from "../modules/IdHolder";
import ExtendedBar from "../modules/ExtendedBar";

const idHolder = new IdHolder();
const autoRedirectButton = new AutoRedirectButton();
const autoEnterCommunityButton = new AutoEnterCommunityButton();
const extendedBar = new ExtendedBar();

export default class ModernCastPage extends Page {

  putButton() {
    $('.program-detail div').last().append(autoRedirectButton.getDom());
    $('.program-detail div').last().append(autoEnterCommunityButton.getDom());
  }

  setUpButton() {
    chrome.runtime.sendMessage({
        purpose: 'getFromLocalStorage',
        key: 'options.autoJump.enable'
      },
      (response) => {
        if (Common.enabledOrNull(response)) {
          autoRedirectButton.toggleOn();
        } else {
          autoRedirectButton.toggleOff();
        }
      }
    );
    chrome.runtime.sendMessage({
        purpose: 'getFromNestedLocalStorage',
        key: 'autoEnterCommunityList'
      },
      (response) => {
        if (response[idHolder.communityId]) {
          autoEnterCommunityButton.toggleOn();
        } else {
          autoEnterCommunityButton.toggleOff();
        }
      }
    );
  }

  putExtendedBar() {
    extendedBar.put('#bourbon-block');
  }

  setUpExtendedBar() {
    extendedBar.setUp();
    $('#extended-bar').css('width', '1024px');
  }

  countExtendedBar() {
    extendedBar.countDown();
  }

  updateExtendedBar(response) {
    extendedBar.update(response);
  }

  invalidateExtendedBar() {
    extendedBar.invalidate();
  }
}