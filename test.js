//Press ^F5 to run without debugging

const array1 = ["cat", "acorn", "desk", "zebra", "door"];
const array2 = [1,3,5,6,2];

array1.sort((a,b)=>{
    return a>b ? 1: a<b ? -1:0;
})

array2.sort((a,b)=>{
    return a>b ? 1: a<b ? -1:0;
})

console.log(array1);
console.log(array2);



