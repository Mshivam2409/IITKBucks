export interface JSONTransactions {
    [key: string]: JSONTransaction
}

export interface JSONTransaction {
    inputs: Array<Input>,
    outputs: Array<Output>
}

export interface unusedOutputs {
    [key: string]: unusedOutput
}

export interface blockChain {
    [key: string]: string
}

export interface transactionData {
    PrivateKey: string,
    numOutput: string,
    PublicKey: string
    transData: Array<transactionDataOutput>
}

interface unusedOutput {
    [key: string]: {
        PublicKey: string,
        Coins: string
    }
}

interface Input {
    transactionId: string;
    index: string;
    signature: string;
}

interface Output {
    amount: string;
    recipient: string;
}

export interface transactionDataOutput {
    coins: string
    alias: string
}
