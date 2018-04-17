const CronJob = require('cron').CronJob;

const task = () => console.log(new Date()); // 현재 시간 출력
const stopAlert = () => console.log('Cron Stopped.'); // 정지 알림

// CronJob(Cron 문자열, 실행할 함수, 종료 시 실행할 함수, 자동 시작 여부, TimeZone);
const job = new CronJob('*/2 * * * * *', task, stopAlert, false, 'Asia/Seoul');

setTimeout(() => job.start()   ,  3000); // App 실행 3초 후 Cron 시작
setTimeout(() => job.stop()    , 13000); // Cron 시작 10초 후 Cron 정지
setTimeout(() => process.exit(), 15000); // Cron 정지 2초 후 App 종료