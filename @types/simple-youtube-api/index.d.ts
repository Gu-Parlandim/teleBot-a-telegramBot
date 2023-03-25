declare module "simple-youtube-api" {
  export default class YouTube {
    constructor(apiKey: string);
    public searchVideos(query: string, limit?: number): Promise<Video[]>;
  }

  class Video {
    public id: string;
    public title: string;
    public url: string;
    public description: string;
    public duration: number;
    public durationSeconds: number;
    public thumbnail: string;
    public channel: Channel;
    public publishedAt: Date;
  }

  class Channel {
    public id: string;
    public name: string;
    public url: string;
    public icon: string;
  }
}
