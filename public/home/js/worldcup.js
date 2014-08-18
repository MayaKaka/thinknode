
(function(){
				var container = document.body;

				camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 5000 );
				camera.position.set( 0, 50, 250 );
				camera.rotation.set( -0.1, 0, 0 );
				scene = new THREE.Scene();

				scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
				scene.fog.color.setHSL( 0.6, 0, 1 );

				var geometry = new THREE.CubeGeometry(10,10,10);
				var material = new THREE.MeshBasicMaterial({color: 0x707070});
				var cube = new THREE.Mesh(geometry, material);
				scene.add(cube);
				// LIGHTS

				hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 500, 0 );
				//scene.add( hemiLight );

				//

				dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
				dirLight.color.setHSL( 0.1, 1, 0.95 );
				dirLight.position.set( -1, 1.75, 1 );
				dirLight.position.multiplyScalar( 50 );
				//scene.add( dirLight );

				dirLight.castShadow = true;

				dirLight.shadowMapWidth = 2048;
				dirLight.shadowMapHeight = 2048;

				var d = 50;

				dirLight.shadowCameraLeft = -d;
				dirLight.shadowCameraRight = d;
				dirLight.shadowCameraTop = d;
				dirLight.shadowCameraBottom = -d;

				dirLight.shadowCameraFar = 3500;
				dirLight.shadowBias = -0.0001;
				dirLight.shadowDarkness = 0.35;
				//dirLight.shadowCameraVisible = true;

				// GROUND

				var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
				var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
				groundMat.color.setHSL( 0.095, 1, 0.75 );

				var ground = new THREE.Mesh( groundGeo, groundMat );
				ground.rotation.x = -Math.PI/2;
				ground.position.y = -33;
				scene.add( ground );

				// ground.receiveShadow = true;

				// SKYDOME

				// MODEL

				var loader = new THREE.JSONLoader();

				

				// RENDERER

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				var domElement = renderer.domElement;
				domElement.style.position = 'absolute';
				domElement.style.left = 0;
				domElement.style.top = 0;
				domElement.style.zIndex = 2;
				container.appendChild( domElement );

				renderer.setClearColor( scene.fog.color, 1 );

				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				renderer.shadowMapEnabled = true;
				renderer.shadowMapCullFace = THREE.CullFaceBack;

				// STATS


			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}
			
			animate();
})();
