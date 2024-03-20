import { use, useEffect, useState } from "react";

export function DeviceInfo({ device }: { device: BluetoothDevice }) {
  const [connected, setConnected] = useState(false);

  if (!device.gatt?.connected) {
    return (
      <PairDeviceMessage
        device={device}
        onConnect={() => {
          setConnected(true);
        }}
      />
    );
  }

  return (
    <>
      <div className="flex items-center">
        <p>Connected to {device.name}</p>
        <button
          onClick={() => {
            device.gatt?.disconnect();
            setConnected(false);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          DISCONNECT
        </button>
      </div>
      {connected && <Characteristics device={device} />}
    </>
  );
}

function PairDeviceMessage({
  device,
  onConnect,
}: {
  device: BluetoothDevice;
  onConnect: () => void;
}) {
  const [failedToConnect, setFailedToConnect] = useState(false);

  const connect = () => {
    device.gatt
      ?.connect()
      .then((e) => {
        setFailedToConnect(false);
        console.log("connected!");
        onConnect();
      })
      .catch((e) => {
        setFailedToConnect(true);
        console.error(e);
      });
  };

  return (
    <div className="flex items-center">
      <p>Paired with {device.name}, want to connect? </p>
      <button
        onClick={connect}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        CONNECT
      </button>
      {failedToConnect && <span>Failed to connect!</span>}
    </div>
  );
}

function Characteristics({ device }: { device: BluetoothDevice }) {
  const [characteristics, setCharacteristics] = useState(
    [] as BluetoothRemoteGATTCharacteristic[]
  );

  useEffect(() => {
    device.gatt?.getPrimaryServices().then((services) => {
      if (services.length > 0) {
        services[0].getCharacteristics().then((characteristics) => {
          setCharacteristics(characteristics);
        });
      }
    });
  }, [device]);

  return (
    <>
      {characteristics.length > 0 && (
        <>
          <p>Characteristics:</p>
          {characteristics.map((e) => (
            <ul key={e.uuid}>{e.uuid}</ul>
          ))}
        </>
      )}
    </>
  );
}
