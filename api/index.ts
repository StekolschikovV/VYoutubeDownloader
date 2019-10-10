import {Info} from './Info';
import {Downloader} from './Downloader';
import {InfoResponse, VideoInfo} from './dataType';

const info = new Info();
const downloader = new Downloader();

const linkC = 'https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA';
const linkC2 = 'https://www.youtube.com/channel/UCXVXf785QNaXYyRUZUmMp2w';
const linkV = 'https://www.youtube.com/watch?v=1Al-nuR1iAU';
// const linkP = 'https://www.youtube.com/playlist?list=PLtULzFUr0kI6bnGZtctCntq6CHE9';
const linkP2 = 'https://www.youtube.com/playlist?list=PLzGr33BqXqFWPc3L1a65IqNGLC6krzXiI';
const linkP = 'https://www.youtube.com/playlist?list=PLtULzFUr0kI6bnGZtctCntq6ACOwQCHE9';

let testVideoInfoList = [];

let videoInfo1 = new VideoInfo(
    'https://www.youtube.com/watch?v=I5SQE_GldD8',
    '1',
    '#Angular #forms\n',
    '00:06:03'
);
testVideoInfoList.push(videoInfo1);

let videoInfo2 = new VideoInfo(
    'https://www.youtube.com/watch?v=jC1dFTC1MXs',
    '2',
    '#Angular #forms\n',
    '00:06:03'
);
testVideoInfoList.push(videoInfo2);

let videoInfo3 = new VideoInfo(
    'https://www.youtube.com/watch?v=eCeDN1F9HaY',
    '3',
    '#Angular #forms\n',
    '00:06:03'
);
testVideoInfoList.push(videoInfo3);

setInterval(() => {
    let answer = downloader.getListImmediately();
    let counter = 0;
    answer.videoInfoList.forEach((e)=>{
        if(e.isLoaded){
            counter++;
        }
    });
    console.log(counter, answer.isLoadNow);
}, 500);

downloader.download(testVideoInfoList);


// let show = (res: InfoResponse) => {
//     console.log('--------------------------------------------------');
//     console.log(res.video.length);
//     console.log(res.video[0].title);
// };
//
// let timer = setInterval(() => {
//     let list = info.getListImmediately();
//     if (!list.isLoadNow) {
//         clearInterval(timer);
//     } else {
//         console.log(list);
//     }
// }, 5000);


//
// info.get(linkP).then((res: InfoResponse) => {
//     show(res);
// });



