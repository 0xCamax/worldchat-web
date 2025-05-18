//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct WorldChatMessage {
    address from;
    uint64 timestamp;
    bytes32[9] content;
    bytes signature; // dynamic-length field, stored outside the struct in calldata
}

contract WorldChat {
    uint internal constant MESSAGE_SIZE = 381;

    event NewChat(address source, string location);

function worldChat(bytes calldata history, string calldata location) public {
    require(history.length % MESSAGE_SIZE == 0, "Invalid history length");

    uint messagesCount = history.length / MESSAGE_SIZE;

    for (uint i = 0; i < messagesCount; i++) {
        bytes memory slice = new bytes(MESSAGE_SIZE);
        for (uint j = 0; j < MESSAGE_SIZE; j++) {
            slice[j] = history[i * MESSAGE_SIZE + j];
        }

        WorldChatMessage memory decoded = decodeWorldChatMessage(slice);

        // Verificar firma
        address recovered = recoverSigner(decoded.from, decoded.timestamp, decoded.content, decoded.signature);
        require(recovered == decoded.from, "Invalid signature");
    }

    emit NewChat(msg.sender, location);
}

    function decodeWorldChatMessage(
        bytes memory data
    ) public pure returns (WorldChatMessage memory) {
        require(data.length == 20 + 8 + 9 * 32 + 65, "Invalid message length");

        address from;
        uint64 _timestamp;
        bytes32[9] memory content;
        bytes memory signature = new bytes(65);

        assembly {
            from := shr(96, mload(add(data, 32))) // bytes 0–19
            _timestamp := mload(add(data, 52)) // bytes 20–27
        }

        // content: bytes 28–315
        for (uint i = 0; i < 9; i++) {
            bytes32 chunk;
            assembly {
                chunk := mload(add(data, add(60, mul(i, 32))))
            }
            content[i] = chunk;
        }

        // signature: bytes 316–380
        for (uint i = 0; i < 65; i++) {
            signature[i] = data[316 + i];
        }

        return
            WorldChatMessage({
                from: from,
                timestamp: _timestamp,
                content: content,
                signature: signature
            });
    }

    function contentToString(
        WorldChatMessage memory msgIn
    ) public pure returns (string memory) {
        bytes memory buffer = new bytes(288);
        for (uint i = 0; i < 9; i++) {
            bytes32 chunk = msgIn.content[i];
            for (uint j = 0; j < 32; j++) {
                buffer[i * 32 + j] = chunk[j];
            }
        }

        uint len = 288;

        while (len > 0 && buffer[len - 1] == 0) {
            len--;
        }
        bytes memory trimmed = new bytes(len);
        for (uint i = 0; i < len; i++) {
            trimmed[i] = buffer[i];
        }
        return string(trimmed);
    }

    function recoverSigner(
        address from,
        uint64 timestamp,
        bytes32[9] memory content,
        bytes memory signature
    ) public pure returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(from, timestamp, content));
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );

        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        return ecrecover(ethSignedHash, v, r, s);
    }
}
