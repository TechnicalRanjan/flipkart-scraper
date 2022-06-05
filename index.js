const puppeteer = require('puppeteer')
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

const data = {
    list : []
}

async function main () {
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    await page.goto('https://www.flipkart.com/search?q=redmi+mobile&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_5_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_5_na_na_na&as-pos=1&as-type=RECENT&suggestionId=redmi+mobile%7CMobiles&requestId=cf8d13ef-95b6-429e-a1cf-dc69f7a81956&as-searchtext=redmi', {
        timeout:0,
        waitUntil:'networkidle0',
    })

    const productData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('div[data-id]')
        items.forEach((item, index) => {
            console.log(`scraping data of product: ${index}`)
            const id = item.getAttribute('data-id')
            const name = item.querySelector('div._4rR01T') && item.querySelector('div._4rR01T').innerText
            const rating = item.querySelector('div._3LWZlK') && item.querySelector('div._3LWZlK').innerText
            const description = item.querySelector('div.fMghEO') && item.querySelector('div.fMghEO').innerText
            
            data.list.push({
                id:id,
                name:name,
                rating:rating,
                description:description
            })
        })
        return data;
        }, data)

        console.log(`successfully collected ${productData.list.length} products`)

        //convert from an object to string
        let json = JSON.stringify(productData)
        fs.writeFile('product.json', json, 'utf8', () => {
            console.log('succesfully written data')
        });
    
}
main()