Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
appDir = FSO.GetParentFolderName(WScript.ScriptFullName)
electronExe = appDir & "\node_modules\electron\dist\electron.exe"

WshShell.CurrentDirectory = appDir
WshShell.Run Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appDir & Chr(34), 0, False