async function sendSneakerInfo(chatId, i, bot, userStorage) {
  const currentIndex = i + 1
  const totalSneakers = userStorage[chatId].sneakers.length

  const sneaker = userStorage[chatId].sneakers[i]
  const sizes = sneaker.size.join(', ')

  const caption =
    `<b>👟 Кроссовки:</b> <i>${sneaker.title}</i>\n\n` +
    `<i>➖ Бренд:</i> ${userStorage[chatId].search}\n` +
    `<i>➖ Пол:</i> ${userStorage[chatId].gender}\n` +
    `<i>➖ Доступные размеры:</i> ${sizes} us\n\n` +
    `<i>💸 Цена:</i> <code>${sneaker.price}</code> руб\n\n`

  bot.sendPhoto(chatId, sneaker.imageUrl, {
    caption,
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {text: '<<', callback_data: 'prev_btn'},
          {text: `${currentIndex}/${totalSneakers}`, callback_data: 'total'},
          {text: '>>', callback_data: 'next_btn'},
        ],
        [
          // TODO: Сделать кнопку карточки
          {
            text: `🔗 Ссылка (${sneaker.title})`,
            web_app: {url: `https://basketshop.ru${sneaker.href}`},
          },
        ],
        [{text: '🏠 Выход в главное меню', callback_data: 'home'}],
      ],
    }),
  })
}

async function updateSneakerInfo(chatId, i, bot, userStorage, messageId) {
  const currentIndex = i + 1
  const totalSneakers = userStorage[chatId].sneakers.length

  const sneaker = userStorage[chatId].sneakers[i]
  const sizes = sneaker.size.join(', ')

  const caption =
    `<b>👟 Кроссовки:</b> <i>${sneaker.title}</i>\n\n` +
    `<i>➖ Бренд:</i> ${userStorage[chatId].search}\n` +
    `<i>➖ Пол:</i> ${userStorage[chatId].gender}\n` +
    `<i>➖ Доступные размеры:</i> ${sizes} us\n\n` +
    `<i>💸 Цена:</i> <code>${sneaker.price}</code> руб\n\n`

  bot.editMessageMedia(
    {
      type: 'photo',
      media: userStorage[chatId].sneakers[i].imageUrl,
      caption: caption,
      parse_mode: 'HTML',
    },
    {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {text: '<<', callback_data: 'prev_btn'},
            {
              text: `${currentIndex}/${totalSneakers}`,
              callback_data: 'total',
            },
            {text: '>>', callback_data: 'next_btn'},
          ],
          [
            {
              text: `🔗 Ссылка (${sneaker.title})`,
              web_app: {url: `https://basketshop.ru${sneaker.href}`},
            },
          ],

          [{text: '🏠 Выход в главное меню', callback_data: 'home'}],
        ],
      }),
    },
  )
}

module.exports = {
  sendSneakerInfo,
  updateSneakerInfo,
}
