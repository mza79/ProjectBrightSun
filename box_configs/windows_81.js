var windows_81 = {
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
    "boot_command": "",
    "winrm_username": "vagrant",
    "winrm_password": "vagrant",
	"output_directory": "output-{{ user `vm_name` }}-virtualbox-iso",
    "winrm_timeout": "{{user `winrm_timeout`}}",
    "shutdown_command": "shutdown /s /t 10 /f /d p:4:1 /c \"Packer Shutdown\"",
    "guest_os_type": "Windows81_64",
    "guest_additions_mode": "{{user `guest_additions_mode`}}",
    "disk_size": "{{user `disk_size`}}",
    "floppy_files": [
        "{{user `autounattend`}}",
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
      "type": "windows-restart"
    },
    {
      "type": "windows-shell",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/set-winrm-automatic.bat",
        "./windows_x64/scripts/compile-dotnet-assemblies.bat",
        "./windows_x64/scripts/uac-enable.bat",
        "./windows_x64/scripts/compact.bat"
      ]
    },
    {
      "type": "powershell",
      "scripts": [
        "./windows_x64/scripts/add-users.ps1",
        "./windows_x64/scripts/add-windows-optional-features.ps1"
      ]
    }
  ],
  "post-processors": [
    {
      "type": "vagrant",
      "keep_input_artifact": false,
      "output": "{{user `output_dir`}}"
    }
  ],
  "variables": {
    "iso_url": "http://download.microsoft.com/download/B/9/9/B999286E-0A47-406D-8B3D-5B5AD7373A4A/9600.16384.WINBLUE_RTM.130821-1623_X64FRE_ENTERPRISE_EVAL_EN-US-IRM_CENA_X64FREE_EN-US_DV5.ISO",
	"platform":"windows",
    "iso_checksum_type": "md5",
    "iso_checksum": "5e4ecb86fd8619641f1d58f96e8561ec",
    "autounattend": "./windows_x64/answer_files/81/Autounattend.xml",
    "disk_size": "61440",
    "headless": "false",
    "vm_name": "windows_81",
    "winrm_timeout": "6h",
    "guest_additions_mode": "disable",
    "memory": "2048",
    "cpus": "2",
	"vm_output":"vm-iso-output",
    "output_dir": "../Boxes/windows_x64/windows_81.box"
  }
}
