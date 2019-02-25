var request = require("request");

module.exports = function(controller) {
  controller.hears(
    ["^hello (.*)", "^hello"],
    "direct_message,direct_mention",
    function(bot, message) {
      bot.reply(message, "What's up, how are you doing ???");
    }
  );
  controller.hears(
    ["^commad (.*)", "^commad"],
    "direct_mention,direct_message,ambient",
    function(bot, message) {
      bot.reply(message, "weather <zipcode>" + "\n" +
                         "returns current weather for zipcode" + "\n\n" +
                         "fiveday <zipcode>" + "\n" + 
                         "returns current weather for next five days (Work in progress)");
    }
  );

  controller.hears(
    ["^weather (.*)", "^weather"],
    "direct_message,direct_mention,ambient",
    function(bot, message) {
      if (message.match[1]) {
        bot.reply(message, "Checking weather for " + message.match[1]);
        request(getWeatherUndergroundAPIUrl(message), function(
          error,
          res,
          body
        ) {
          if (!error && res.statusCode == 200) {
            var reaction = "";
            var data = JSON.parse(body);
            for (let weather of data.weather) {
              bot.reply(message, {
                title: "Weather for " + message.match[1],
                text: "Local condition is: " + weather.main + "\n" + ":sunny:",
                icon_emoji: ":sunny:",
              });
            }
          }
        });
      } else {
        bot.reply(message, "No zipcode entered");
      }
    }
  );
};

function getWeatherUndergroundAPIUrl(message) {
  url =
    "https://api.openweathermap.org/data/2.5/weather?zip=" +
    message.match[1] +
    ",us&&APPID=7a93048745e5894efd2c26cf0f9395c6";
  return url;
}
