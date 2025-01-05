window.onblur = function() {
    document.title = "お兄ちゃん、早く帰ってきて";
};
window.onfocus = function() {
    document.title = "お兄ちゃん、おかえりなさい";
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    sleep(1000).then(() => {
        document.title = musicTitle.innerText;
    })
    
};