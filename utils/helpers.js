// Instead of doing this formatting with Moment,
// we use the methods built into the Date object.
// This way, we can avoid bringing in unnecessary dependencies.
// If we needed more utility around time and date manipulation,
// then we could justify adding Moment.
module.exports = {
    format_date: (date) => {
      return `${new Date(date).getMonth() + 1}/${new Date(
        date
      ).getDate()}/${new Date(date).getFullYear()}`;
    },
  
    format_plural: (word, amount) => {
      if (amount !== 1) {
        return `${word}s`;
      }
      return word;
    },
  };
  