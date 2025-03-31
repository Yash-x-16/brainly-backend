"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    let str = "ashcajshdbcjhdcuqvwicdyq12344566899";
    let ans = "";
    let length = str.length;
    let i = 0;
    for (i = 0; i < len; i++) {
        ans += str[Math.floor((Math.random() * length))];
    }
    return ans;
}
