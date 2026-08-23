Vagrant.configure("2") do |config|
	is_arm = RUBY_PLATFORM.include?("arm64") || RUBY_PLATFORM.include?("aarch64")
    config.vm.synced_folder ".", "/vagrant", disabled: true
	config.vm.define "frontend" do |frontend|
		frontend.vm.box = "bento/ubuntu-22.04" if is_arm
		frontend.vm.box = "ubuntu/jammy64" if !is_arm
		frontend.vm.box_architecture = "arm64" if is_arm
		frontend.vm.hostname = "frontend"

        frontend.vm.network "forwarded_port", guest: 80, host: 8080
        frontend.vm.network "forwarded_port", guest: 443, host: 8443

		frontend.vm.network "private_network", ip: "10.20.30.1",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		frontend.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "frontend"
			end

        frontend.vm.synced_folder "frontend/", "/vagrant/app"
        
		frontend.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get -y install net-tools
			sudo apt-get -y install lynx
			sudo apt-get -y install telnet
            
            # configuracao de ip forwarding
            sudo sysctl -w net.ipv4.ip_forward=1
            echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
            sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
            sudo iptables -A FORWARD -i eth0 -o enp0s8 -m state --state RELATED,ESTABLISHED -j ACCEPT
            sudo iptables -A FORWARD -i enp0s8 -o eth0 -j ACCEPT
		SHELL
	end

	config.vm.define "backend" do |backend|
		backend.vm.box = "bento/ubuntu-22.04" if is_arm
		backend.vm.box = "ubuntu/jammy64" if !is_arm
		backend.vm.box_architecture = "arm64" if is_arm
		backend.vm.hostname = "backend"
		backend.vm.network "private_network", ip: "10.20.30.2",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		backend.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "backend"
			end

        backend.vm.synced_folder "backend/", "/vagrant/app"

		backend.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get -y install net-tools
			sudo apt-get -y install lynx
			sudo apt-get -y install conntrack
			sudo apt-get -y install telnet

            sudo ip route add default via 10.20.30.1 dev enp0s8 || true
		SHELL
	end

	config.vm.define "db" do |db|
		db.vm.box = "bento/ubuntu-22.04" if is_arm
		db.vm.box = "ubuntu/jammy64" if !is_arm
		db.vm.box_architecture = "arm64" if is_arm
		db.vm.hostname = "db"
		db.vm.network "private_network", ip: "10.20.30.3",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		db.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "db"
			end

        db.vm.synced_folder "database/", "/vagrant/app"
		db.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get -y install net-tools
			sudo apt-get -y install lynx
			sudo apt-get -y install conntrack
			sudo apt-get -y install telnet

            sudo ip route add default via 10.20.30.1 dev enp0s8 || true
		SHELL
	end


	config.vm.define "storage" do |storage|
		storage.vm.box = "bento/ubuntu-22.04" if is_arm
		storage.vm.box = "ubuntu/jammy64" if !is_arm
		storage.vm.box_architecture = "arm64" if is_arm
		storage.vm.hostname = "storage"
		storage.vm.network "private_network", ip: "10.20.30.4",netmask: "255.255.255.0", virtualbox__intnet: "intnet1"
		storage.vm.provider "virtualbox" do |vb|
			vb.gui = !is_arm
			vb.memory = "1024"
			vb.cpus = 1
			vb.name = "storage"
			end

        storage.vm.synced_folder "storage/", "/vagrant/app"
		storage.vm.provision "shell", inline: <<-SHELL
			sudo apt-get -y update
			sudo apt-get -y install net-tools
			sudo apt-get -y install lynx
			sudo apt-get -y install conntrack
			sudo apt-get -y install telnet

            sudo ip route add default via 10.20.30.1 dev enp0s8 || true
		SHELL
	end
end