const TelegramApi = require('node-telegram-bot-api')
const { config } = require('dotenv')

const { gender_option } = require('./src/app/components/gender_func')
const { logger, objectToString } = require('./src/app/components/logger')

config()
const bot = new TelegramApi(process.env.TOKEN, { polling: true })
const userStorage = {}

const main = async () => {
	console.log('Bot create by Anton Kamaev')

	bot.onText(/\/start/, async msg => {
		bot.deleteMessage(msg.chat.id, msg.message_id - 1)
		bot.deleteMessage(msg.chat.id, msg.message_id)
		bot.sendMessage(
			msg.chat.id,
			`<b>✌🏼 Yo <i>${msg.chat.first_name}</i></b>! Я помогу тебе подобрать кроссовки по твоему запросу.\n\n<i>💭 Давай для начала выберем твой пол.</i>`,
			{
				parse_mode: 'HTML',
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{ text: 'Мужские', callback_data: 'man' },
							{ text: 'Женские', callback_data: 'woman' },
						],
					],
				}),
			}
		)
		logger.info(
			`${msg.chat.first_name} start using bot\n${objectToString(msg.from)}`
		)
	})

	/*Callbacks controller*/
	bot.on('callback_query', async msg => {
		const chat_id = msg.message.chat.id
		const user = msg.message.chat.first_name

		switch (msg.data) {
			case 'man':
				userStorage[chat_id] = { gender: msg.data }
				await gender_option(bot, msg, userStorage)
				logger.info(`${user} select ${userStorage[chat_id].gender}`)
				break

			case 'woman':
				userStorage[chat_id] = { gender: msg.data }
				await gender_option(bot, msg, userStorage)
				logger.info(`${user} select ${userStorage[chat_id].gender}`)
				break

			case 'home':
				bot.deleteMessage(chat_id, msg.message.message_id)
				bot.sendMessage(chat_id, `<b>✌🏼 Yo <i>${msg.message.chat.first_name}</i></b>! Я помогу тебе подобрать кроссовки по твоему запросу.\n\n<i>💭 Давай для начала выберем твой пол.</i>`,
					{
						parse_mode: 'HTML',
						reply_markup: JSON.stringify({
							inline_keyboard: [
								[
									{ text: 'Мужские', callback_data: 'man' },
									{ text: 'Женские', callback_data: 'woman' },
								],
							],
						}),

					})
		}
	})

	bot.on('text', async msg => {
		const chatId = msg.chat.id
		const messageId = msg.message_id
		console.log(userStorage[chatId])

		if (userStorage[chatId]) {
			switch (userStorage[chatId].state) {
				case 'awaitText':
					userStorage[chatId] = {
						search: msg.text,
						gender: userStorage[chatId].gender,
					}

					userStorage[chatId].link = `https://www.basketshop.ru/?digiSearch=true&term=${userStorage[chatId].search
						}${userStorage[chatId].gender == 'man' ? '%20мужские' : '%20женские'
						}&params=%7Cfilter%3Dcategories%3A46%7Csort%3DDEFAULT
					`
					const response = await fetch(userStorage[chatId].link)

					response.status === 200 ?
						bot.editMessageText(userStorage[chatId].link, {
							chat_id: chatId,
							message_id: messageId - 1,
							reply_markup: JSON.stringify({
								inline_keyboard: [
									[{ text: 'Домой', callback_data: 'home' }]
								]
							})
						}
						) : bot.deleteMessage(chatId, messageId - 1).then(bot.sendMessage(chatId, 'Я такого не нашел'))
					break
			}
		}
	})
}

main()
