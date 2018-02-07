# coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')


class OnFind:
    def __init__(self, result):
        self.result = result

    def onFindCallback(self, string, index1, index2):
        self.result.append((string, index1, index2))


class OnGetSecondString:
    def __init__(self, str1, index1, onFind):
        self.str1 = str1
        self.index1 = index1
        self.onFind = onFind

    def compare(self, str2, index2):
        if self.str1 == str2:
            self.onFind.onFindCallback(str2, self.index1, index2)


class Finder:
    def __init__(self, rawString):
        self.rawString = rawString
        self.result = []

    def isFind(self):
        onFind = OnFind(self.result)
        self.find(onFind)
        return len(self.result) > 0

    def getResult(self):
        return self.result

    def find(self, onFind):
        def onGetFirstString(str1, index1):
            onGetSecondString = OnGetSecondString(str1, index1, onFind)
            return self.getSecondString(str1, index1, onGetSecondString)
        self.getFirstString(onGetFirstString)

    def rawStringLen(self):
        return len(self.rawString)

    def getFirstString(self, onGetFirstString):
        for start in range(self.rawStringLen()):
            for end in range(start+1, self.rawStringLen()+1):
                firstString = self.rawString[start: end]
                onGetFirstString(firstString, start)

    def getSecondString(self, str1, index1, onGetSecondString):
        str2StartIndex = index1 + len(str1)
        str2EndIndex = index1 + len(str1) + len(str1)
        if str2EndIndex <= self.rawStringLen():
            str2 = self.rawString[str2StartIndex:str2EndIndex]
            onGetSecondString.compare(str2, str2StartIndex)


finder = Finder("abcaaabc")
finder.isFind()
for result in finder.getResult():
    print result
