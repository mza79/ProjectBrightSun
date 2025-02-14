var windows_server_2016 = {
  "builders": [{
	"output_directory":"{{user `vm_output`}}",
	"type": "virtualbox-iso",
    "vm_name": "{{user `vm_name`}}",
	"communicator": "winrm",
	"iso_url": "{{user `iso_url`}}",
	"iso_checksum_type": "{{user `iso_checksum_type`}}",
	"iso_checksum": "{{user `iso_checksum`}}",
	"headless": "{{user `headless`}}",
	"boot_wait": "4m",
	"output_directory": "output-{{ user `vm_name` }}-virtualbox-iso",
    "boot_command": "",
	"winrm_username": "vagrant",
	"winrm_password": "vagrant",
	"winrm_timeout": "{{user `winrm_timeout`}}",
	"shutdown_command": "a:/sysprep.bat",
	"guest_os_type": "Windows2016_64",
	"guest_additions_mode": "{{user `guest_additions_mode`}}",
	"disk_size": "{{user `disk_size`}}",
	"floppy_files": [
		"{{user `autounattend`}}",
		"./windows_x64/floppy/WindowsPowershell.lnk",
		"./windows_x64/floppy/PinTo10.exe",
		"./windows_x64/scripts/unattend.xml",
		"./windows_x64/scripts/sysprep.bat",
		"./windows_x64/scripts/disable-screensaver.ps1",
		"./windows_x64/scripts/disable-winrm.ps1",
		"./windows_x64/scripts/enable-winrm.ps1",
		"./windows_x64/scripts/microsoft-updates.bat",
		"./windows_x64/scripts/win-updates.ps1",
		"./windows_x64/scripts/oracle-cert.cer",
        "./windows_x64/configs/local_users.json",
        "./windows_x64/configs/windows_optional_features.json"
    ],
    "vboxmanage": [
      ["modifyvm", "{{.Name}}", "--memory", "{{user `memory`}}"],
      ["modifyvm", "{{.Name}}", "--cpus", "{{user `cpus`}}"]
    ]
  }],
  "provisioners": [
    {
      "type": "windows-shell",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/vm-guest-tools.bat",
        "./windows_x64/scripts/enable-rdp.bat"
      ]
    },
    {
      "type": "powershell",
      "scripts": [
        "./windows_x64/scripts/debloat-windows.ps1"
      ]
    },
    {
      "type": "windows-restart"
    },
    {
      "type": "windows-shell",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/pin-powershell.bat",
        "./windows_x64/scripts/set-winrm-automatic.bat",
        "./windows_x64/scripts/compile-dotnet-assemblies.bat",
        "./windows_x64/scripts/uac-enable.bat",
        "./windows_x64/scripts/compact.bat"
      ]
    },
    {
      "type": "file",
      "source": "./windows_x64/answer_files/2016/Autounattend_sysprep.xml",
      "destination": "c:/Windows/Temp/Autounattend_sysprep.xml"
    },
    {
      "type": "powershell",
      "scripts": [
        "./windows_x64/scripts/add-users.ps1",
        "./windows_x64/scripts/add-windows-optional-features.ps1"
      ]
    }
  ],
  "post-processors": [{
	"type": "vagrant",
	"keep_input_artifact": false,
	"output": "{{user `output_dir`}}"
  }],
  "variables": {
    "iso_url": "http://care.dlservice.microsoft.com/dl/download/1/4/9/149D5452-9B29-4274-B6B3-5361DBDA30BC/14393.0.161119-1705.RS1_REFRESH_SERVER_EVAL_X64FRE_EN-US.ISO",
	"platform":"windows",
    "iso_checksum_type": "md5",
    "iso_checksum": "70721288BBCDFE3239D8F8C0FAE55F1F",
    "autounattend": "./windows_x64/answer_files/2016/Autounattend.xml",
	"disk_size": "61440",
    "headless": "false",
    "vm_name": "windows_server_2016",
    "winrm_timeout": "6h",
    "guest_additions_mode": "disable",
    "memory": "2048",
    "cpus": "2",
	"vm_output":"vm-iso-output",
    "output_dir": "../Boxes/windows_x64/windows_server_2016.box"
  }
}
