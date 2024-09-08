import { promises as fs } from 'fs'
import { parse } from "csv"

type Config = { headers: string[], mapper: number[], delimiter: string }

const run = async () => {
    const { headers, mapper, delimiter }: Config = (await import('./config')).default


    const content = await fs.readFile(`${__dirname}/input.csv`, 'utf8')
    const records = parse(content, {delimiter, bom: true, escape: false})
    
    const rows = []
    for await (const record of records) rows.push(record)

    const output = rows.reduce((acc, row, index) => index === 0
        ? [...acc, headers.join(';')]
        : [...acc, mapper.map((mapper) => mapper !== -1 ? row[mapper] : '').join(';')]
    , [])

    await fs.writeFile(`${__dirname}/ouput.csv`, output.join('\r\n'), 'utf8')
}

run().then(_data => {
    console.log("success")
    process.exitCode = 0
}).catch((error) => {
    console.error('error', error)
    process.exitCode = 1
})