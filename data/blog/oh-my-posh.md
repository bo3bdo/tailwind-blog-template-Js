---
title: oh my posh
date: '2023-07-09'
tags: ['Windows']
draft: false
summary: While Oh My Posh works on the standard terminal, we advise using the Windows Terminal.
image: 'https://bo3bdo.com/storage/blog/images/lrdqox2wUTXdKx0CfX8s1FV4Xi7Vmqgt6vLsRhG5.png'
---

## nstallation​

- winget

* Open a PowerShell prompt and run the following command:

```Shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

- install a font
  When the above command gives an error, make sure to create the profile first.

```Shell
New-Item -Path $PROFILE -Type File -Force
```

Then add the following line.

```Shell
oh-my-posh init pwsh | Invoke-Expression

Install-Module PSReadLine -AllowPrerelease -Force
```

If you want the latest, otherwise remove the Prerelease. Then edit your $profile. I usually do this:

```Shell
notepad $PROFILE
And add


if ($host.Name -eq 'ConsoleHost')
{
Import-Module PSReadLine
}
Is your prompt
```

not extra enough? That's because your directory listing needs color AND cool icons!

```Shell
Install-Module -Name Terminal-Icons -Repository PSGallery
```

And then add one line to my $profile (edit with "code $profile"):

```Shell
Import-Module -Name Terminal-Icons
notepad $PROFILE

oh-my-posh init pwsh --config 'C:\Users\bo3bd\AppData\Local\Programs\oh-my-posh\themes\patriksvensson.omp.json' | Invoke-Expression if ($host.Name -eq 'ConsoleHost') { Import-Module PSReadLine }
```
