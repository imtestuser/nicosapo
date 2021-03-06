import Db from './modules/db'
import Badge from './modules/Badge'
import BackgroundReloader from './modules/BackgroundReloader'
import Common from './common/Common'
import AutoEnterRunner from './autoEnter/AutoEnterRunner'
import './chrome/runtime.onMessage'

Badge.setBackgroundColor('#ff6200');
Db.setAll('autoEnterCommunityList', 'state', 'init');
BackgroundReloader.run();
setInterval(BackgroundReloader.run, 60 * 1000);
Common.sleep(7 * 1000).then(() => {
  setInterval(() => {
    Promise.resolve()
      .then((new AutoEnterRunner()).run('live'))
      .then((new AutoEnterRunner()).run('community'));
  }, 60 * 1000);
});
