function A() {
  return "A";
}

// function B() {
//   return setTimeout(() => {
//     console.log("B");
//   }, 2000);
// }

const C = () => "C";

function D(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(text);
    }, 2000);
  });
}

console.log(await D("test"));

D("test 2").then((result) => {
  console.log(result);
  console.log(A());
});

(async () => {
  console.log(C());
})();
