/* 
    * 1. Render songs //ok
    * 2. Scroll top //ok
    * 3. Play/pause/seek //ok
    * 4. CD rotate //ok
    * 5. Next/prev //ok
    * 6. Random //ok
    * 7. Next/playback when ended //ok
    * 8. Active song //ok
    * 9. Scroll active song into view //ok
    * 10. Play song when click //ok
    * 11. Render current playing time/duration //ok
*/


const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY='PLAYER';

const cd=$('.cd');
const heading=$('.song_play h2');
const cdThumb=$('.cd_thumbnail');
const audio=$('#audio');
const progress=$('.progress');
const playBtn=$('.play_song');
const nextBtn=$('.next_song i');
const prevBtn=$('.prev_song i');
const randomBtn=$('.random_song');
const randomBtnIcon=$('.random_song i');
const repeatBtnIcon=$('.playback i');
const repeatBtn=$('.playback');
const currentTime=$('.current_time');
const durationTime=$('.duration_time');
const playList=$('.playlist');

const songPlayList=new Set();

const app={
    currentIndex:0,
    isPlaying:false,
    isRepeat:false,
    isRandom:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    songs: [ 
        {
            name:'Anh nhà ở đâu thế',
            singer:'Amee',
            path:'./music/song1.mp3',
            image:'./img/amee.jpg'
        },
        {
            name:'Cho mình em',
            singer:'Binz',
            path:'./music/song2.mp3',
            image:'./img/binz.jpg'
        },
        {
            name:'Lose yourself',
            singer:'Eminem',
            path:'./music/song3.mp3',
            image:'./img/eminem.jpg'
        },
        {
            name:'Q.L.C',
            singer:'Hưng cao',
            path:'./music/song4.mp3',
            image:'./img/hưng_cao.jpg'
        },
        {
            name:'Ain\'t got no haters',
            singer:'Ice Cube',
            path:'./music/song5.mp3',
            image:'./img/ice_cube.jpg'
        },
        {
            name:'Peaches',
            singer:'Justin Bieber',
            path:'./music/song6.mp3',
            image:'./img/justin_bieber.jpg'
        },
        {
            name:'Loving you sunny',
            singer:'Kimmese',
            path:'./music/song7.mp3',
            image:'./img/kimmese.jpg'
        },
        {
            name:'Happy for you',
            singer:'Vũ',
            path:'./music/song8.mp3',
            image:'./img/vũ.jpg'
        },
        {
            name:'Gone',
            singer:'Rosé',
            path:'./music/song9.mp3',
            image:'./img/rosé.jpg'
        },
    ],
    setConfig:function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },

    // assign property to object
    defineProperties:function(){
        // định nghĩa thuộc tính cho object
        Object.defineProperty(this,"currentSong",{
            get:function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    // load up the page
    render:function(){
        const htmls=this.songs.map(function(song,index){
            return `
            <div class="song_list align ${index===this.currentIndex?'active':''}" data-index="${index}">
                <div class="song_img" style="background: url('${song.image}') center no-repeat;
                background-size: cover"></div>
                <div class="song_title">
                    <div class="song_name">${song.name}</div>
                    <div class="author">${song.singer}</div>
                </div>
                <div class="song_more"><i class="fa-solid fa-ellipsis"></i></div>
            </div>
            `
        })
        playList.innerHTML=htmls.join('');
    },

    // handle event
    handleEvent:function(){
        const _this=this;
        const cdWith=cd.offsetWidth;

        // when scrolling
        document.addEventListener('scroll',function(){
            const scrollTop=window.scrollY||document.documentElement.scrollTop;
            const newCdWidth=cdWith-scrollTop;

            cd.style.width=newCdWidth>0?newCdWidth+'px':0;
            cd.style.opacity=newCdWidth/cdWith;
        })

        // Xử lý cd quay/dừng
        const cdThumAnimate=cdThumb.animate([
            {
                transform:'rotate(360deg)'
            }
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdThumAnimate.pause();

        // random song
        randomBtnIcon.onclick=function(){
            _this.isRandom=!_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        // when repeat song
        repeatBtnIcon.onclick=function(){
            _this.isRepeat=!_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // click btn
        playBtn.addEventListener('click',()=>{
            // click to play/pause
            if(!_this.isPlaying)audio.play();
            else audio.pause();

            // when the song is playing
            audio.onplay=function(){
                _this.isPlaying=true;
                playBtn.classList.add('play');
                cdThumAnimate.play();
            }
            audio.onpause=function(){
                _this.isPlaying=false;
                playBtn.classList.remove('play');
                cdThumAnimate.pause();
            }
        })
        
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){
            if(_this.isPlaying){
                const currentProgress=Math.floor(audio.currentTime/audio.duration*100)
                progress.value=currentProgress;
                // xử lý thời gian
                currentTime.textContent=_this.timeFormat(this.currentTime);
                durationTime.textContent=_this.timeFormat(this.duration);
            }
        }

        // click next/back btn
        nextBtn.addEventListener('click',()=>{
            if(this.isRandom){
                _this.randomSong();
                audio.play();
                playBtn.classList.add('play');
                _this.isPlaying=true;    
            }else {
                _this.nextSong();
                audio.play();
                playBtn.classList.add('play');
                _this.isPlaying=true;
            }
        })
        prevBtn.addEventListener('click',()=>{
            if(this.isRandom){
                _this.randomSong();
                audio.play();
                playBtn.classList.add('play');
                _this.isPlaying=true;    
            }else {
                _this.prevSong();
                audio.play();
                playBtn.classList.add('play');
                _this.isPlaying=true;
            }
        })
        
        // tua bài hát
        progress.oninput=function(e){
            if(!_this.isPlaying){
                playBtn.click();
            }
            const seekTime=audio.duration/100 * e.target.value;
            audio.currentTime=seekTime;
        }

        // when song end
        audio.onended=()=>{
            if(this.isRepeat){
                audio.play();
                _this.isPlaying=true;
            }else if(this.isRandom){
                _this.randomSong();
                audio.play();
            }
            else nextBtn.click();
        }

        // Click not active song
        playList.onclick=function(e){
            const songElements=e.target.closest('.song_list:not(.active)');
            if(songElements||e.target.closest('.song_more')){
                if(songElements){
                    _this.currentIndex=Number(songElements.dataset.index);
                    _this.loadCurrentSong();
                    playBtn.click();
                    audio.play();
                }
            }
        }
    },

    // keep repeat and random when u refresh page using localStorage
    loadConfig: function(){
        this.isRandom=this.config.isRandom;
        this.isRepeat=this.config.isRepeat;

        // Hiển thị trạng thái ban đầu của 2 nút qua local storage
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    },

    // when click next/back song
    nextSong:function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length)this.currentIndex=0;

        this.loadCurrentSong();
    },
    prevSong:function(){
        this.currentIndex--;
        if(this.currentIndex<0)this.currentIndex=this.songs.length-1;

        this.loadCurrentSong();
    },   

    // Random song
    randomSong:function(){
        let newIndex;
        do{
            newIndex=Math.floor(Math.random()*this.songs.length);
        }while(songPlayList.has(newIndex));
        this.currentIndex=newIndex;
        this.loadCurrentSong();
        songPlayList.add(newIndex);
        if(songPlayList.size===this.songs.length)songPlayList.clear();
        this.activeSong();
    },

    // Time format
    timeFormat: function(seconds){
        // tạo ra 1 giá trị date bất kỳ với giây = 0 sau đó gán giá trị giây 
        // toTimeString là 1 quy chuẩn trả về 1 string time
        // ta có thể dùng slice để lấy giây, phút
        let date=new Date("2021-03-25T12:00:00Z");
        date.setSeconds(seconds);
        return date.toTimeString().slice(3,8);
        // toTimeString returns the time portion of the given date object in English
        // toISOString returns a string in simplified extended ISO format (ISO 8601)
    },
    
    // active song
    activeSong:function(){
        const songs=$$('.song_list');
        songs.forEach((song,index)=>{
            if(index==this.currentIndex){
                song.classList.add('active');
                setTimeout(()=>{
                    song.scrollIntoView({
                        behavior:'smooth',
                        block:'center',
                        inline:'center'
                    })
                },300)
            }else song.classList.remove('active');
        })
    },

    // render song attribute 
    loadCurrentSong:function(){
        heading.textContent=this.currentSong.name;
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`;
        audio.src=this.currentSong.path;
        this.activeSong();
    },
    start:function(){

        this.loadConfig();

        this.defineProperties();

        this.handleEvent();

        this.loadCurrentSong();

        this.render();
    }
}

app.start();