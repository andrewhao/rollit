import {format} from 'date-fns';

const todayString = format(new Date(), 'yyyy-MM-dd')

export {todayString};

export default `c.js today is ${todayString}`;
