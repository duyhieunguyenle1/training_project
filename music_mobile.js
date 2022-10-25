const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const app={
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
            image:'./music/justin_bieber.jpg'
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
    render:function(){
        const htmls=this.songs.map(function(song){
            return `
            <div class="song_img" style="background: url('${song.image}') center no-repeat;
            background-size: cover"></div>
            <div class="song_title">
                <div class="song_name">${song.name}</div>
                <div class="author">${song.singer}</div>
            </div>
            <div class="song_more"><i class="fa-solid fa-ellipsis"></i></div>
            `
        })
        $('.song').innerHTML=htmls.join('');
    },
    start:function(){
        this.render();
    }
}
app.start();