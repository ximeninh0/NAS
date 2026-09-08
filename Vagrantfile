Vagrant.configure("2") do |config|
	is_arm = RUBY_PLATFORM.include?("arm64") || RUBY_PLATFORM.include?("aarch64")
	box = is_arm ? "bento/ubuntu-22.04" : "ubuntu/focal64"

	config.vm.box = box
	config.vm.box_architecture = "arm64" if is_arm

	config.vm.define "frontend" do |frontend|
		frontend.vm.hostname = "frontend"
		frontend.vm.network "forwarded_port", guest: 80, host: 8080
		frontend.vm.network "private_network", ip: "10.20.30.1", netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		frontend.vm.synced_folder "./frontend", "/app"
		frontend.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "frontend"
		end
		frontend.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get install -y nginx nodejs npm
		SHELL
	end

	# O storage precisa iniciar antes do backend, que monta o compartilhamento NFS.
	config.vm.define "storage" do |storage|
		storage.vm.hostname = "storage"
		storage.vm.network "private_network", ip: "10.20.30.4", netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		storage.vm.synced_folder "./storage", "/app"
		storage.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "storage"
		end
		storage.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get -y install net-tools nfs-kernel-server

			sudo mkdir -p /srv/nas
			sudo chmod 777 /srv/nas

			if ! grep -q "^/srv/nas 10.20.30.2" /etc/exports; then
				echo "/srv/nas 10.20.30.2(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports
			fi

			sudo exportfs -ra
			sudo systemctl enable nfs-kernel-server
			sudo systemctl restart nfs-kernel-server
		SHELL
	end
	
	config.vm.define "database" do |database|
		database.vm.hostname = "database"

		database.vm.network "private_network", ip: "10.20.30.3", netmask: "255.255.255.0", virtualbox__intnet: "intnet1"

		database.vm.synced_folder "./database", "/app"

		database.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "db"
		end

		database.vm.provision "shell", inline: <<-SHELL
			sudo apt-get update -y
			sudo apt-get install -y mysql-server

			sudo sed -i 's/127.0.0.1/0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

			sudo systemctl restart mysql

				sudo mysql -e "CREATE DATABASE IF NOT EXISTS nas_db;"
				sudo mysql -e "CREATE USER IF NOT EXISTS 'nas_user'@'10.20.30.2' IDENTIFIED BY 'senha123';"
				sudo mysql -e "ALTER USER 'nas_user'@'10.20.30.2' IDENTIFIED BY 'senha123';"
				sudo mysql -e "GRANT ALL PRIVILEGES ON nas_db.* TO 'nas_user'@'10.20.30.2';"
			SHELL
		end

	config.vm.define "backend" do |backend|
        backend.vm.hostname = "backend"
        backend.vm.network "private_network", ip: "10.20.30.2", netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
        backend.vm.synced_folder "./backend", "/app"
        backend.vm.provider "virtualbox" do |vb|
            vb.gui = !is_arm
            vb.memory = "1024"
            vb.cpus = 1
            vb.name = "backend"
        end
        backend.vm.provision "shell", inline: <<-SHELL
            sudo apt-get -y update
            sudo apt-get -y install net-tools nfs-common python3 python3-pip python3-venv

            sudo mkdir -p /mnt/nas
            
			if ! grep -q "^10.20.30.4:/srv/nas /mnt/nas" /etc/fstab; then #ve se ja existe uma linha que começa com 10.20.30....
				echo "10.20.30.4:/srv/nas /mnt/nas nfs defaults,_netdev 0 0" | sudo tee -a /etc/fstab
				#se n existe coloque...
				#10.20.30.4: - ip do storage, onde a pasta esta fisicamente
			fi
			
            mountpoint -q /mnt/nas || sudo mount /mnt/nas

            python3 -m venv /home/vagrant/venv
            /home/vagrant/venv/bin/pip install --upgrade pip
            /home/vagrant/venv/bin/pip install -r /app/requirements.txt

            chown -R vagrant:vagrant /home/vagrant/venv
        SHELL
    end

end
