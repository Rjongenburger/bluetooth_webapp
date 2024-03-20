"use client";

import { useEffect, useState } from "react";
import { DeviceInfo } from "./deviceinfo";

export default function Home() {
  const [device, setDevice] = useState(null as BluetoothDevice | null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 max-w-5xl w-full items-start justify-between font-sans text-sm lg:flex flex-col">
        <h1 className="text-lg">Bluetooth Webapp tester</h1>
        <Availability />
        {device && <DeviceInfo device={device} />}
        <RequestDevice
          onDevicePaired={(device) => {
            setDevice(device);
          }}
        />
        <GetDevices />
        <RequestLEScan />
      </div>
    </main>
  );
}

function Availability() {
  const [availability, setAvailability] = useState("Loading....");
  useEffect(() => {
    navigator.bluetooth
      .getAvailability()
      .then((available: boolean) => {
        if (available) {
          setAvailability("This device supports Bluetooth!");
        } else {
          setAvailability("Bluetooth is not supported");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return <p>{availability}</p>;
}

function RequestDevice({
  onDevicePaired,
}: {
  onDevicePaired: (device: BluetoothDevice) => void;
}) {
  const [failedToPair, setFailedToPair] = useState(false);

  const getDevices = () => {
    navigator.bluetooth
      .requestDevice({
        optionalServices: [],
        acceptAllDevices: true,
      })
      .then((device) => {
        setFailedToPair(false);
        onDevicePaired(device);
        console.log(`Name: ${device.name}`);
      })
      .catch((error) => {
        setFailedToPair(true);
        console.error(error);
      });
  };

  return (
    <div className="flex items-center">
      <button
        onClick={getDevices}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        PAIR DEVICE
      </button>
      {failedToPair && "Failed to pair!"}
    </div>
  );
}

function GetDevices() {
  const [devicesMessage, setDevicesMessage] = useState("");

  const getDevice = () => {
    navigator.bluetooth
      .getDevices()
      .then((devices: BluetoothDevice[]) => {
        if (devices.length > 0) {
          setDevicesMessage(`${devices.map((e) => e.name)}`);
        } else {
          setDevicesMessage("No devices found!");
        }

        console.log(devices);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="flex items-center">
      <button
        onClick={getDevice}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        GET PAIRED DEVICES
      </button>
      <p>{devicesMessage}</p>
    </div>
  );
}

function RequestLEScan() {
  const scan = () => {
    navigator.bluetooth
      .requestLEScan({
        acceptAllAdvertisements: true,
      })
      .then((scan) => {
        console.log(scan);
        scan.stop();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <button
      onClick={scan}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
    >
      REQUEST LE SCAN
    </button>
  );
}
