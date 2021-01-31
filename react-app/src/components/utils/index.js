
export default function timeStamp(createdAt, short= false ){
  let now = Date.now();
  let elapsed = now - createdAt;
  let timestamp;

  let s, m1, m, h1, h;
  if(short){
    s = 's';
    m1 = m = 'm';
    h1 = h = 'h';
  } else {
    s = 'SECONDS AGO';
    m1 = 'MINUTE AGO';
    m = 'MINUTES AGO';
    h1 = 'HOUR AGO';
    h = 'HOURS AGO';
  }

  if (elapsed < 1000) {
    timestamp = `NOW`;
  } else if (elapsed < 60000) {
    timestamp = `${Math.floor(elapsed / 1000)} ${s}`;
  } else if (elapsed < 120000) {
    timestamp = `${Math.floor(elapsed / 60000)} ${m1}`;
  } else if (elapsed < 3600000) {
    timestamp = `${Math.floor(elapsed / 60000)} ${m}`;
  } else if (elapsed < 7200000) {
    timestamp = `${Math.floor(elapsed / 3600000)} ${h1}`;
  } else if (elapsed < 86400000) {
    timestamp = `${Math.floor(elapsed / 3600000)} ${h}`;
  } else {
    timestamp = createdAt.toDateString().split(" ").splice(1, 2).join(" ");
  }

  return timestamp;
}