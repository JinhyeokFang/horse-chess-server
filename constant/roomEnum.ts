enum GameStatus {
    Waiting = 0,
    InGame = 1,
    End = 2,
    WillBeDeleted = 3
};

/*
Waiting - 유저를 기다리는 중
InGame - 게임을 진행중임
End - 게임이 끝남
WillBeDeleted - 삭제를 기다리는 방
*/

export { GameStatus }