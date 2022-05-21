from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
from pyvirtualdisplay import Display
with Display(visible=True, size=(1200, 1500)):
	chromedriver = '/usr/bin/chromedriver'
	chrome_options = Options()
	#chrome_options.add_argument('--headless')
	chrome_options.add_argument('--no-sandbox')
	chrome_options.add_argument('--disable-dev-shm-usage')
	driver = webdriver.Chrome(options=chrome_options)
	driver.get("https://faucet.ropsten.be/")
	time.sleep(10)
	addr_element = driver.find_element_by_xpath('//input[@placeholder="Enter your testnet account address"]')
	addr_element.clear()
	addr = '0xF501B6b7BC08D832a6b37B743C27e81A7fD2248'
	addr_element.send_keys(addr)
	time.sleep(2)
	driver.find_element_by_xpath("//button[contains(text(),'Send me test Ether')]").click()
	time.sleep(2)
	driver.quit()




