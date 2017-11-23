

module.exports = {
  generateRandomChars: function (chars, length) {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  //   printTest: function(){
  //     console.log('did this get required?');
  // }
};
