# World Chat: Gasless Wallet-to-Wallet Communication

World Chat (PoC) permite la comunicación directa entre billeteras de criptomonedas, utilizando la mempool como base de datos. Esta aproximación habilita transacciones sin gas y facilita la validación de datos de contratos inteligentes en cada mensaje.

## Características Principales

* **Comunicación Gasless:** Los usuarios pueden enviar mensajes a otras billeteras sin incurrir en costos de gas. Esto se logra al aprovechar la mempool para transmitir datos en lugar de depender de transacciones tradicionales en la blockchain.
* **Mempool como Base de Datos:** World Chat utiliza la mempool de la red blockchain como un espacio de almacenamiento temporal para los mensajes. Cada mensaje se transmite como una transacción, que luego es recogida por otros nodos.
* **Validación de Datos de Contratos Inteligentes:** Los datos enviados en cada mensaje pueden incluir información que permite la validación de contratos inteligentes. Esto abre la puerta a interacciones ricas y verificables entre billeteras, más allá del simple envío de texto.
* **Comunicación Directa entre Billeteras:** World Chat facilita la comunicación directa peer-to-peer entre billeteras, eliminando la necesidad de intermediarios centralizados.

## Cómo Funciona

1.  **Envío de Mensajes:** Cuando un usuario envía un mensaje, la aplicación construye una transacción que contiene el mensaje codificado. En lugar de transmitir esta transacción para su inclusión en un bloque, la aplicación la difunde a la mempool.
2.  **Transmisión por la Mempool:** La transacción reside en la mempool, donde otros nodos de la red pueden verla.
3.  **Recepción de Mensajes:** La app monitorean la mempool en busca de transacciones dirigidas a el smart contract. Cuando se detecta una transacción relevante, la app extrae el mensaje.
4.  **Validación de Datos:** La transaccion es una transaccion a el smart contract por lo que para poder entrar a la mempool debe pasar las validaciones del smart contract.

## Tecnologías Utilizadas

* Frontend: [Deno Fresh]
* Blockchain: [Ethereum Sepolia]
* Gestión de Billeteras: [ethers]
* Comunicación: Mempool

## Casos de Uso

* **Mensajería Descentralizada:** Permite a los usuarios enviar mensajes de forma segura y descentralizada, sin depender de servidores centralizados.
* **Interacción de Contratos Inteligentes:** Facilita interacciones complejas entre billeteras, como votaciones, transferencias de activos condicionadas o ejecución de lógica de contratos inteligentes.
* **Aplicaciones Sociales:** Permite la creación de aplicaciones sociales descentralizadas donde los usuarios pueden comunicarse e interactuar directamente entre sí.
* **Entry Point para delegar envio de transacciones**

## Requisitos

* Una billetera de criptomonedas compatible.
* Conexión a Internet.

## Licencia

Este proyecto está licenciado bajo la licencia [MIT].
