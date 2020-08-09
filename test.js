// const test = {

//     COLOR: {
//         a: 10
//     },

//     b: this.COLOR.a
// }

const test = {
    prop: 42,
    b: function () {
        console.log(this.prop)
    }
};

console.log(test.b());
// expected output: 42