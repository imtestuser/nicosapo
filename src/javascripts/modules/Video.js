import $ from 'jquery';

export default class Video {
  constructor() {
    this.content = $(this._xml());
    this.table = {
      title:      `title`,
      id:         `id`,
      openTimeJp: `open_time_jpstr`,
      isReserved: `is_reserved`,
    }
  }

  set(prop, value) {
    this.content.find(this.table[prop]).text(value);
  }

  get(prop) {
    return this.content.find(this.table[prop]).text();
  }

  xml() {
    return this.content;
  }

  _xml() {
    return `
      <video>
        <id></id>
        <title></title>
        <open_time></open_time>
        <open_time_jpstr></open_time_jpstr>
        <start_time></start_time>
        <schedule_end_time/>
        <end_time></end_time>
        <provider_type>y</provider_type>
        <related_channel_id/>
        <hidescore_online></hidescore_online>
        <hidescore_comment></hidescore_comment>
        <community_only></community_only>
        <channel_only></channel_only>
        <view_counter></view_counter>
        <comment_count></comment_count>
        <is_panorama></is_panorama>
        <_ts_reserved_count></_ts_reserved_count>
        <timeshift_enabled></timeshift_enabled>
        <is_hq></is_hq>
        <is_reserved></is_reserved>
      </video>
    `
  }
}
