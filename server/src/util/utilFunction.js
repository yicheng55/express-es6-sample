import moment from 'moment';
function formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

export default formatDate