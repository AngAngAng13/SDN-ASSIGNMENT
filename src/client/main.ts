import $  from 'jquery';
const sayHello = () => {
  
  console.log('Hello from the client-side TypeScript file!');
  alert('Hello from the client-side TypeScript file!');
};

document.addEventListener('DOMContentLoaded', () => {
  sayHello();
  
});
