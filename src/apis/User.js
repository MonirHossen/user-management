import Api from './Api'
const END_POINT = '?results=5000';
export default {
    all(){
        return Api.get(END_POINT)
    },
}