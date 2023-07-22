import { PDFDocument } from 'pdf-lib'
import { getAddress, formatUnits } from 'ethers'
import supportedNetworks from '@/data/networks'


export default async function handler(req, res) {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.setTitle('Report')

    const page = await pdfDoc.addPage()
    const { width, height } = page.getSize()

    page.drawText('Your Transactions', { x: width / 2.75, y: height - 50, size: 15 })

    let line = 1

    for (const [chainId, transactions] of Object.entries(req.body.transactions)) {
        const networkData = supportedNetworks.find(network => network.chainId === chainId)

        line += 1
        page.drawText(networkData.name, { x: 20, y: height - 50 - line * 20, size: 15 })
        line += 1

        if (transactions.length === 0) {
            page.drawText('No transactions found', { x: 20, y: height - 50 - line * 20, size: 10 })
            line += 1
            continue
        }

        for (const txData of transactions) {
            const lineHeight = height - 50 - line * 20

            const tokenAddress = getAddress(txData['tokenAddress'] || txData['contractAddress'])
            const token = req.body.tokens[chainId].find(token => token.address === tokenAddress)

            let dateString = 'Missing Date'

            if (txData['timeStamp']) {
                dateString = new Date(parseInt(txData['timeStamp']) * 1000).toLocaleString()
            } else if (txData['blockTimestamp']) {
                dateString = new Date(parseInt(txData['blockTimestamp'])).toLocaleString()
            }

            page.drawText(dateString, { x: 20, y: lineHeight, size: 10 })

            const from = (typeof txData['from'] === 'string') ? txData['from'] : txData['from']['addresses'][0]

            const action = req.body.address === from ? 'Sold' : 'Bought'
            page.drawText(action, { x: 240, y: lineHeight, size: 10 })

            const decimals = parseInt(txData['tokenDecimal'] || '6')
            const formattedAmount = formatUnits(txData['amount'] || txData['value'], decimals)
            page.drawText(formattedAmount, { x: width - 200, y: lineHeight, size: 10 })

            page.drawText(token['symbol'], { x: width - 50, y: lineHeight, size: 10 })

            line += 1
        }
    }

    const pdfBytes = await pdfDoc.save()
    res.setHeader('Content-Type', 'application/pdf')
    res.send(Buffer.from(pdfBytes))
}