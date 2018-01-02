import axios from 'axios'

export default class BaseCom{
    promisify  (fn, receiver)  {
        return (...args) => {
            return new Promise((resolve, reject) => {
                fn.apply(receiver, [...args, (err, res) => {
                    return err ? reject(err) : resolve(res);
                }]);
            });
        };
    }



}