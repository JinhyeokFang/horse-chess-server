class Store {
    private static instance;
    private userDataList: any[] = [];
    private constructor () {}

    public connectUser(userSocketId: number) {
        this.userDataList.push({userSocketId})
    }

    public disconnectUser(userSocketId: number) {
        this.userDataList.splice(this.userDataList.findIndex(user => user.userSocketId == userSocketId),1)
    }

    public get userList () {
        return this.userDataList;
    }

    public static getInstance() {
        if (!Store.instance)
            Store.instance = new Store();

        console.log(Store.instance)

        return Store.instance; 
    }
}

export default Store;