export interface IAwaitingMusic {
  chatId: number;
}

export class AwaitingMusicDB {
  private static listOfAwaitingMusic: IAwaitingMusic[] = [];

  static addAwaitingMusic(chatId: number) {
    this.listOfAwaitingMusic.push({ chatId });
  }

  static removeAwaitingMusic(chatId: number) {
    this.listOfAwaitingMusic = this.listOfAwaitingMusic.filter(
      (music) => music.chatId !== chatId
    );
  }

  static isAwaitingMusic(chatId: number) {
    return this.listOfAwaitingMusic.some(
      (awaitingID) => awaitingID.chatId === chatId
    );
  }
}
