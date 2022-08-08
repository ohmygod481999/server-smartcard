const { WALLET_TYPE } = require("./constants");

exports.getCurrentTime = () => {
    let now = new Date();
    now.setHours(now.getHours() + 7);
    return now;
};

exports.getWalletFromWallets = (wallets) => {
    let mainWallet = null;
    let secondaryWallet = null;

    wallets.forEach((wallet) => {
        if (wallet.type === WALLET_TYPE.MAIN) {
            mainWallet = wallet;
        }
        if (wallet.type === WALLET_TYPE.SECONDARY) {
            secondaryWallet = wallet;
        }
    });
    return {
        mainWallet,
        secondaryWallet,
    };
};
