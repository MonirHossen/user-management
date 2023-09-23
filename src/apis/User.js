import Api from './Api'
const END_POINT = '?results=20';
export default {
    all(){
        return Api.get(END_POINT)
    },
}