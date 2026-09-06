Vagrant.configure("2") do |config|
	is_arm = RUBY_PLATFORM.include?("arm64") || RUBY_PLATFORM.include?("aarch64")
	config.vm.define "frontend" do |client|
		client.vm.box = "bento/ubuntu-22.04" if is_arm
		client.vm.box = "ubuntu/focal64" if !is_arm
		client.vm.box_architecture = "arm64" if is_arm
		client.vm.hostname = "frontend"
		client.vm.network "forwarded_port", guest: 80, host: 8080
		client.vm.network "private_network", ip: "10.20.30.1",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		client.vm.synced_folder "./frontend", "/app"
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
		client02.vm.synced_folder "./backend", "/app"
		client02.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "backend"
			end
		client02.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update

			sudo apt-get -y install net-tools
			sudo apt-get -y install nfs-common #instala o cliente NFS, back-client e storage-servidor

			sudo mkdir -p /mnt/nas #cria uma pasta no back- é a pasta que vai ser a janela da pasta que esta no disco da vm4

			if ! grep -q "^10.20.30.4:/srv/nas /mnt/nas" /etc/fstab; then #ve se ja existe uma linha que começa com 10.20.30....
				echo "10.20.30.4:/srv/nas /mnt/nas nfs defaults,_netdev 0 0" | sudo tee -a /etc/fstab
				#se n existe coloque...
				#10.20.30.4: - ip do storage, onde a pasta esta fisicamente
			fi

			sudo mount -a
		SHELL
	end


	config.vm.define "database" do |client03|
		client03.vm.box = "bento/ubuntu-22.04" if is_arm
		client03.vm.box = "ubuntu/focal64" if !is_arm
		client03.vm.box_architecture = "arm64" if is_arm
		client03.vm.hostname = "database"
		client03.vm.network "private_network", ip: "10.20.30.3",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		client03.vm.synced_folder "./database", "/app"
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
		client04.vm.synced_folder "./storage", "/app"
		client04.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "storage"
			end
		client04.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update

			sudo apt-get -y install net-tools
			sudo apt-get -y install nfs-kernel-server #instala o servidor NFS - storage vai ser o serivdor

			sudo mkdir -p /srv/nas #vai criar o arquivo fisico que vai ficar no storage e que o backend vai acessar essa pasta
			sudo chmod 777 /srv/nas #libera para leitura e escrita

			if ! grep -q "^/srv/nas 10.20.30.2" /etc/exports; then #ele vai procurar se ja existe a linha no arquivo /etc/exports,
				#se nao existir ele vai adicionar a linha
				echo "/srv/nas 10.20.30.2(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports
				#se n~çao encontrar a linha "/srv/nas 10.20.30.2" /etc/exports", adiciona a linha ao arquivo
				#/nas a pasta compartilhada,
				#10.20.30.2 - quem vai poder acessar essa pasta
			fi

			sudo exportfs -ra
			sudo systemctl enable nfs-kernel-server
			sudo systemctl restart nfs-kernel-server
		SHELL
	end
end