Vagrant.configure("2") do |config|
	is_arm = RUBY_PLATFORM.include?("arm64") || RUBY_PLATFORM.include?("aarch64")
	config.vm.define "frontend" do |client|
		client.vm.box = "bento/ubuntu-22.04" if is_arm
		client.vm.box = "ubuntu/focal64" if !is_arm
		client.vm.box_architecture = "arm64" if is_arm
		client.vm.hostname = "frontend"
		client.vm.network "forwarded_port", guest: 80, host: 8080
		client.vm.network "private_network", ip: "10.20.30.1",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		client.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "frontend"
			end
		client.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get install -y nginx nodejs npm
		SHELL
	end

	config.vm.define "backend" do |client02|
		client02.vm.box = "bento/ubuntu-22.04" if is_arm
		client02.vm.box = "ubuntu/focal64" if !is_arm
		client02.vm.box_architecture = "arm64" if is_arm
		client02.vm.hostname = "backend"
		client02.vm.network "private_network", ip: "10.20.30.2",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		client02.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "backend"
			end
		client02.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get install -y nodejs npm nfs-common
		SHELL
	end


	config.vm.define "database" do |client03|
		client03.vm.box = "bento/ubuntu-22.04" if is_arm
		client03.vm.box = "ubuntu/focal64" if !is_arm
		client03.vm.box_architecture = "arm64" if is_arm
		client03.vm.hostname = "database"
		client03.vm.network "private_network", ip: "10.20.30.3",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		client03.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "db"
			end
		client03.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get install -y mysql-server
		SHELL
	end

	config.vm.define "storage" do |client04|
		client04.vm.box = "bento/ubuntu-22.04" if is_arm
		client04.vm.box = "ubuntu/focal64" if !is_arm
		client04.vm.box_architecture = "arm64" if is_arm
		client04.vm.hostname = "storage"
		client04.vm.network "private_network", ip: "10.20.30.4",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		client04.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "storage"
			end
		client04.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get install -y nfs-kernel-server
		SHELL
	end
end