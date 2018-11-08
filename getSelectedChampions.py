from http.client import HTTPSConnection
from base64 import b64encode
import ssl
import json
import time

pickedChampions = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]

def main():
        while True:
                actions = requestSelectedChampions()
                if actions:
                        handleSelectedChampions(actions)
                        printSelectedChampions()
                time.sleep(5)

def printSelectedChampions():
        print(pickedChampions[0], "\t", pickedChampions[5], "\n",
                pickedChampions[1], "\t", pickedChampions[6], "\n",
                pickedChampions[2], "\t", pickedChampions[7], "\n",
                pickedChampions[3], "\t", pickedChampions[8], "\n",
                pickedChampions[4], "\t", pickedChampions[9], "\n\n\n")

def requestSelectedChampions():
        c = HTTPSConnection("127.0.0.1", 58814, context=ssl._create_unverified_context())
        userAndPass = b64encode(b"riot:uGGSZMEsc9iiu3POaBN4tQ").decode("ascii")
        headers = { 'Accept' : 'application/json', 'Authorization' : 'Basic %s' % userAndPass }
        c.request('GET', '/lol-champ-select/v1/session', headers=headers)
        response = c.getresponse()
        data = response.read().decode('utf-8')
        jsonObj = json.loads(data)
        if "actions" in jsonObj:
                return jsonObj["actions"]
        else:
                return False

def handleSelectedChampions(actions):
        for actionList in actions:
                for action in actionList:
                        if action["completed"] and action["type"] == "pick":
                                pickedChampions[action["actorCellId"]] = action["championId"]

main()