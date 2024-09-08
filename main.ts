import { promises as fs } from 'fs'
import { parse } from "csv"
import path from 'path';

type Formatter = {
    headers: string[],
    mapper: number[],
    delimiter: string
}
interface Config {
    useFormatter: string,
    [key: string]: Formatter | string;
}

async function deleteSpecificFiles(files: string[]): Promise<void> {
    const dir = `${__dirname}`;
    try {

      for (const file of files) {
        const filePath = path.join(dir, file);
        await fs.unlink(filePath);
        console.log(`Deleted: ${file}`);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    }
  }

async function findCSVFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(`${__dirname}`);
      const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
      return csvFiles;
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }

const splitArray = <T>(arr: T[], test: (a: T) => boolean): [T[], T[]] => arr.reduce((acc, item) => {

    test(item) ? acc[0].push(item) : acc[1].push(item)

    return acc
}, [[], []] as [T[], T[]])

const run = async () => {
    // Load the JSON file manually
    const configFileContent = await fs.readFile(`${__dirname}/config.json`, 'utf8');
    const fullConfig: Config = JSON.parse(configFileContent);
    const files = await findCSVFiles();
    console.log(files)
    const [filesForDeletion, inputFiles] = splitArray(files, (file) => file.includes('ouput.csv'));
    deleteSpecificFiles(filesForDeletion);

    const { headers, mapper, delimiter }: Formatter = fullConfig[fullConfig.useFormatter];


    const content = await fs.readFile(`${__dirname}/${inputFiles[0]}`, 'utf8');
    const records = parse(content, { delimiter, bom: true, escape: false });
    
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