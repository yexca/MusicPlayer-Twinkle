// 获取DOM元素
const $ = Dom => document.querySelector(Dom);
const class$ = Dom => document.querySelectorAll(Dom);
const volumeBtn = $(".volume"); //音量按钮
const musicListBtn = $(".music_list"); //列表按钮
const musicListsBox = $(".music_lists");//列表显示容器
const musicAudio = $(".music_audio"); //重中之重 音乐控件
const musicTitle = $(".music_title"); //音乐标题 
const musicUp = $(".music_up"); // 上一首
const musicDuration = $(".music_duration"); // 时长显示
const durationControl = $(".duration_control"); //时长控制
const musicPlay = $(".music_play") // 播放
const musicPause = $(".music_pause")// 暂停
const musicNext = $(".music_next") // 下一首
let activePlay = -1; // 当前播放的那一首
let playModeStatus = "cycle"; //播放模式 (默认)cycle:列表循环 oneCycle:单曲循环 random:随机播放
const playModeStatusObj = {
    cycle: "oneCycle",
    oneCycle: "random",
    random: "cycle",
}
const musicList = [
    { title: "twinkle - ちゅ~してくれなきゃヤダヤダ!", url: "./music/twinkle - ちゅ~してくれなきゃヤダヤダ!.mp3", cover: "./cover/1504 ろりんくる.jpg"},
    { title: "ttwinkle - ろりりん☆ろりんくる", url: "./music/twinkle - ろりりん☆ろりんくる.mp3", cover: "./cover/1504 ろりんくる.jpg"},
    { title: "twinkle - 夏Koiゆかた☆ふぇぇ…スティバル!", url: "./music/twinkle - 夏Koiゆかた☆ふぇぇ…スティバル!.mp3", cover: "./cover/1508 夏Koiゆかた☆ふぇぇ…スティバル!.png"},

] //音乐播放列表

// 消息提醒
const message = (messageInfo) => {
    let messageStatus = {
        success: {
            color: "#67C23A",
            backgroundColor: "#F0F9EB"
        },
        warning: {
            color: "#E6A23C",
            backgroundColor: "#FDF6EC"
        },
        error: {
            color: "#F56C6C",
            backgroundColor: "#FEF0F0"
        },
    }
    let messageDom = document.createElement("div");
    let keepTime = messageInfo.keepTime || 1500
    messageDom.innerText = messageInfo.message || ""
    let messageStyle = {
        color: "#909399",
        backgroundColor: "#EDF2FC",
        position: "fixed",
        top: "-20%",
        left: "50%",
        transform: "translate(-50% , 0)",
        width: "420px",
        borderRadius: "5px",
        boxSizing: "border-box",
        padding: "15px 20px",
        transition: "all 0.6s",
    };

    if (messageInfo.type) {
        messageStyle.color = messageStatus[messageInfo.type].color;
        messageStyle.backgroundColor = messageStatus[messageInfo.type].backgroundColor;
    }

    for (let styleKey in messageStyle) {
        messageDom.style[styleKey] = messageStyle[styleKey];
    }

    document.body.appendChild(messageDom)
    setTimeout(() => {
        messageDom.style['top'] = "10%";
    })

    setTimeout(() => {
        messageDom.style['top'] = "-20%"
        setTimeout(() => {
            messageDom.remove()
        }, 600)

    }, keepTime)
}

// 渲染播放列表
const createMusicList = () => {
    let musicListHtml = "";
    // <div class="music_list_index">${index + 1}< /div>
    musicList.forEach((el, index) => {
        musicListHtml += `
            <div class="info ${activePlay == index ? 'active' : ''}" data-index="${index}"> 
                <div class="music_list_index">
                    ${activePlay == index ?
                `<div class="playing">
                    <div class="side1"></div>
                    <div class="side2"></div>
                    <div class="side3"></div>
                 </div>`
                : index + 1}
                </div>
                
                <div class="music_list_title">${el.title}</div>
                <div class="music_list_delete" data-index="${index}"></div>
            </div>`
    })

    musicListsBox.innerHTML = musicListHtml;
    // 点击播放
    class$(".info").forEach((dom_el) => {
        dom_el.onclick = (e) => {
            activePlay = dom_el.dataset['index'];
            initialize();
        }
    })
    // 
    class$(".music_list_delete").forEach((dom_el) => {
        dom_el.onclick = (e) => {
            e.stopPropagation();
            musicList.splice(dom_el.dataset['index'], 1);
            if (activePlay == dom_el.dataset['index']) {
                activePlay--;
                initialize();
            }
            createMusicList()

        }
    })
}
/*图标3*/
// 播放模式控制
$(".play_mode").onclick = (e) => {
    playModeStatus = playModeStatusObj[playModeStatus];
    $(".play_mode").style.backgroundImage = `url("../icon/${playModeStatus}.png")`;
}

// 音量按钮
volumeBtn.onclick = (e) => {
    $(".volume_control").style.display == "block" ? $(".volume_control").style.display = "none" : $(".volume_control").style.display = "block";
}

// 控制音量
$(".volume_control").children[0].onchange = (e) => {
    musicAudio.volume = $(".volume_control").children[0].value / 100
}


// 列表点击事件
musicListBtn.onclick = (e) => {
    musicListsBox.style.animation == "musicListShow .3s linear" ? musicListsBox.style.animation = "musicListHidden .3s linear" : musicListsBox.style.animation = "musicListShow .3s linear"
    setTimeout(() => {
        musicListsBox.style.display == 'block' ? (musicListsBox.style.display = "none") : (musicListsBox.style.display = "block")
    }, 300)
    musicListsBox.style.height == '300px' ? (musicListsBox.style.height = "0px") : (musicListsBox.style.height = "300px")
    createMusicList()
}
//播放模式 (默认)cycle:列表循环 oneCycle:单曲循环 random:随机播放
// 上一首
musicUp.onclick = (e) => {
    if (activePlay === 0 && playModeStatus != "random") {
        message({ type: "warning", message: "已经是第一首了" })
        return;
    }
    if (activePlay !== -1 && playModeStatus != "random") {
        activePlay--;
    }
    if (playModeStatus == 'random') {
        activePlay = Math.floor(Math.random() * 11);
    }

    initialize();

}
// 下一首
musicNext.onclick = (e) => {
    if (musicList.length == 0) {
        message({ type: "error", message: "播放列表中暂无歌曲" });
        return;
    }
    if (activePlay == musicList.length - 1 && playModeStatus != "random") {
        activePlay = 0;
        initialize();
        return;
    }

    if (activePlay !== -1 && playModeStatus != "random") {
        activePlay++;
    }

    if (playModeStatus == 'random') {
        activePlay = Math.floor(Math.random() * 11);
    }

    initialize();
}

// 渲染音频
const initialize = () => {
    if (musicList.length == 0) {
        message({ type: "error", message: "播放列表中暂无歌曲" });
        musicTitle.innerText = "刷新一下吧~";
        musicAudio.src = "";
        // 设置默认封面
        $(".music_image").src = "./cover/default_cover.png";
        durationControl.disabled = true;
        durationControl.value = 0;
        return;
    }


    if (activePlay === -1) {
        activePlay = 0;
    }

    createMusicList()
    musicTitle.innerText = musicList[activePlay].title;
    musicAudio.src = musicList[activePlay].url;
    // 更新封面
    $(".music_image").src = musicList[activePlay].cover || "./cover/default_cover.png";
    durationControl.disabled = false;
    musicAudio.play();

    /*音乐页面标题*/
    document.title = musicTitle.innerText;
}


// 时长控制器状态值发生改变时
durationControl.onchange = (e) => {
    musicAudio.currentTime = durationControl.value;
}

// 歌曲开始播放时
musicAudio.onplay = (e) => {
    musicPlay.style.display = "none";
    musicPause.style.display = "block";
    [...$(".playing").children].forEach(el => el.style.animationPlayState = "")

}

// 歌曲暂停时
musicAudio.onpause = (e) => {
    musicPlay.style.display = "block";
    musicPause.style.display = "none";
    [...$(".playing").children].forEach(el => el.style.animationPlayState = "paused")
}


// 歌曲播放结束时
musicAudio.onended = (e) => {
    musicPlay.style.display = "block";
    musicPause.style.display = "none";
    if (playModeStatus == "oneCycle") {
        musicAudio.play()
        return;
    }
    if (activePlay == musicList.length - 1 && playModeStatus == "cycle") {
        activePlay = 0;
        initialize();
        return;
    }
    if (activePlay != musicList.length - 1 && playModeStatus != "oneCycle") {
        activePlay++;
    }

    if (playModeStatus == 'random') {
        activePlay = Math.floor(Math.random() * 11);
    }
    initialize();
}
// 时长更改时会执行
musicAudio.ontimeupdate = (e) => {
    if (musicAudio.currentTime >= 0 && musicAudio.duration >= 0) {
        let totalF = parseInt(musicAudio.duration / 60); //总时长 分钟
        let totalM = parseInt(musicAudio.duration % 60) < 10 ? '0' + parseInt(musicAudio.duration % 60) : parseInt(musicAudio.duration % 60); //总时长 秒数
        let currentF = parseInt(musicAudio.currentTime / 60);
        let currentM = parseInt(musicAudio.currentTime % 60) < 10 ? '0' + parseInt(musicAudio.currentTime % 60) : parseInt(musicAudio.currentTime % 60);
        musicDuration.innerHTML = ` ${currentF}:${currentM} / ${totalF}:${totalM}`;
        durationControl.max = musicAudio.duration;
        durationControl.value = musicAudio.currentTime;
    }
}

// 开始播放
musicPlay.onclick = (e) => {
    if (activePlay !== -1) {
        musicAudio.play().catch(err => console.error('播放失败:', err));
        return;
    }
    initialize()
}

musicPause.onclick = (e) => {
    musicAudio.pause();
}